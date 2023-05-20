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
    let parentNodes = [];
    // for (let i = 0; i < selectedNode.length; i++) {
    //   parentNodes.push({
    //     key: i,
    //     node: selectedNode[i],
    //     parentsArray: [],
    //   });
    // }

    for (let i = 0; i < selectedNode.length; i++) {
      let parentArray = [];
      let currentChild = selectedNode[i] as BaseNode;
      while (currentChild.type != "PAGE") {
        parentArray.push(currentChild);
        let parentNode = currentChild.parent;
        let currentChildID = currentChild.id;
        let siblingNodes = parentNode?.children;
        if (parentNode != null) {
          currentChild = parentNode;
        }
      }
      parentNodes.push({
        key: i,
        node: selectedNode[i],
        parentsArray: parentArray.reverse(),
      });
    }

    let largestIndex = findLargestIndex(parentNodes)[0];
    let largestParentNode = findLargestIndex(parentNodes)[1];
    console.log(largestIndex);
    const skipNodes = [];
    const skipNodeMap = [];
    for (let i = 1; i < largestIndex; i++) {
      let skipNodeParents = [];
      for (let j = 0; j < parentNodes.length; j++) {
        if (i < parentNodes[j].parentsArray.length) {
          skipNodes.push(parentNodes[j].parentsArray[i].id);
          skipNodeParents.push(parentNodes[j].parentsArray[i].parent);
        }

        for (let parent of skipNodeParents) {
          if (parent != null) {
            for (let child of parent.children) {
              if (skipNodes.indexOf(child.id) > -1) {
                (child as FrameNode).opacity = 1;
              } else {
                (child as FrameNode).opacity = 0.06;
              }
            }
          }
        }
      }
    }

    console.log(skipNodes);
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  figma.closePlugin();
};

function findLargestIndex(parentNodes: any) {
  let index = -1;
  let largestParent;
  for (let i = 0; i < parentNodes.length; i++) {
    if (parentNodes[i].parentsArray.length > index) {
      index = parentNodes[i].parentsArray.length;
      largestParent = parentNodes[i].parentsArray;
    }
  }
  return [index, largestParent];
}
