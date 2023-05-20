// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === "create-rectangles") {
    let selectedNode = figma.currentPage.selection;
    let parentArray = [];
    parentArray.push(selectedNode[0].name);
    if (selectedNode.length == 1) {
      let currentChild = selectedNode[0] as BaseNode;
      while (currentChild.type != "PAGE") {
        let parentNode = currentChild.parent;
        let currentChildID = currentChild.id;
        let siblingNodes = parentNode?.children;
        if (siblingNodes != null) {
          for (const traversedNode of siblingNodes) {
            let tNode = traversedNode as FrameNode;
            if (traversedNode.id != currentChildID) {
              console.log("here is one tnode: ", tNode);
              tNode.opacity = 0.06;
            }
          }
        }

        parentArray.push(parentNode?.name);
        if (parentNode != null) {
          currentChild = parentNode;
        }
      }
    }
    console.log(parentArray);
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  figma.closePlugin();
};
