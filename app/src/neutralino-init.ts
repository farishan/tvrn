import { init, os, events, app } from "@neutralinojs/lib"

function setTray() {
  if (NL_MODE != "window") {
    console.log("INFO: Tray menu is only available in the window mode.");
    return;
  }
  const tray = {
    icon: "/resources/icons/trayIcon.png",
    menuItems: [
      { id: "VERSION", text: "Get version" },
      { id: "SEP", text: "-" },
      { id: "QUIT", text: "Quit" }
    ]
  };
  os.setTray(tray);
}

function onTrayMenuItemClicked(event: { detail: { id: string | number } }) {
  switch (event.detail.id) {
    case "VERSION":
      os.showMessageBox("Version information",
        `${NL_APPID} is running on port ${NL_PORT}  inside ${NL_OS}.\nNeutralinojs server: v${NL_VERSION} | Neutralinojs client: v${NL_CVERSION}`);
      break;
    case "QUIT":
      app.exit();
      break;
  }
}

async function getViteServerPID() {
  const info = await os.execCommand('lsof -i :5174 | grep "localhost:5174 (LISTEN)"')
  /*
    info.stdOut should contains something like this:
    COMMAND   PID  USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
    node    20963 faris   26u  IPv4 223877      0t0  TCP localhost:5173 (LISTEN)
  */
  const fields = info.stdOut.split(/\s+/);
  const data = {
    COMMAND: fields[0],
    PID: fields[1],
    USER: fields[2],
    FD: fields[3],
    TYPE: fields[4],
    DEVICE: fields[5],
    "SIZE/OFF": fields[6],
    NODE: fields[7],
    NAME: fields[8]
  };

  return data.PID
}

/** @see https://neutralino.js.org/docs/api/os#return-object-awaited */
async function execCommandWithTimeout(command: string, timeout: number): Promise<Neutralino.os.ExecCommandResult> {
  // Adjust timeout implementation based on your environment's capabilities
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Command timed out after ${timeout}ms`));
    }, timeout);

    os.execCommand(command)
      .then(resolve)
      .catch(reject)
      .finally(() => clearTimeout(timeoutId));
  });
}

async function onWindowClose() {
  try {
    const viteServerPID = await getViteServerPID();

    if (viteServerPID) {
      try {
        const { exitCode } = await execCommandWithTimeout(`kill ${viteServerPID}`, 5000);
        if (exitCode === 0) {
          console.log('Vite server killed successfully.');
        } else {
          console.log('Failed to kill Vite server.');
        }
      } catch (error) {
        console.log('Error killing Vite server:', error);
      }
    } else {
      console.log('Invalid Vite server PID.');
    }
  } catch (error) {
    console.log('Error retrieving Vite server PID:', error);
  } finally {
    console.log('Exiting app.');
    app.exit();
  }
}

function neutralinoInit() {
  init();

  events.on("trayMenuItemClicked", onTrayMenuItemClicked);
  events.on("windowClose", onWindowClose);

  if (NL_OS != "Darwin") { // TODO: Fix https://github.com/neutralinojs/neutralinojs/issues/615
    setTray();
  }
}

export { neutralinoInit }
