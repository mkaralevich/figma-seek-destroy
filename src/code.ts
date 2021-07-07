figma.showUI(__html__, { width: 320 });

figma.ui.onmessage = (msg) => {
	if (msg.type === "destroy-components") {
		const selection = [...figma.currentPage.selection];
		let updatedSelection = [];

		function destroyComps(nodes) {
			if (Array.isArray(nodes)) {
				return nodes.map((child) => {
					if (child.type === "INSTANCE" && !child.removed) {
						const detached = child.detachInstance();
						updatedSelection = [...updatedSelection, detached];
						if (detached.children) destroyComps(detached.children);
					}
					if (child.type !== "INSTANCE" && child.type !== "COMPONENT") {
						if (child.children) destroyComps(child.children);
					}

					// If Component
					if (child.type === "COMPONENT" && !child.removed) {
						const parent = figma.currentPage.findOne(
							(n) => n.id === child.parentId
						);
						const childProps = {
							parentId: child.parentId,
							x: child.x,
							y: child.y,
						};

						const copy = child.createInstance();

						copy.x = childProps.x;
						copy.y = childProps.y;

						parent.insertChild(copy);
					}
				});
			}
		}
		destroyComps(selection);
		figma.currentPage.selection = updatedSelection;
	}

	if (msg.type === "unstyle-elements") {
		const selection = [...figma.currentPage.selection];

		const clearStyles = (node) => {
			if (node.type === "TEXT") {
				node.textStyleId = "";
				node.effectStyleId = "";
				node.fillStyleId = "";
				node.strokeStyleId = "";
			}
			if (
				node.type === "FRAME" ||
				node.type === "INSTANCE" ||
				node.type === "COMPONENT"
			) {
				node.gridStyleId = "";
				node.effectStyleId = "";
				node.fillStyleId = "";
				node.strokeStyleId = "";
			}
			if (
				node.type === "RECTANGLE" ||
				node.type === "ELLIPSE" ||
				node.type === "LINE" ||
				node.type === "STAR" ||
				node.type === "VECTOR" ||
				node.type === "POLYGON" ||
				node.type === "BOOLEAN_OPERATION"
			) {
				node.effectStyleId = "";
				node.fillStyleId = "";
				node.strokeStyleId = "";
			}
			if (node.type === "GROUP") return null;
		};

		function removeStyles(nodes) {
			if (Array.isArray(nodes)) {
				return nodes.map((child) => {
					clearStyles(child);

					if (child.children) removeStyles(child.children);
				});
			}
		}
		removeStyles(selection);
	}

	// figma.closePlugin();
};
