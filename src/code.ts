figma.showUI(__html__, { width: 320, height: 96 });

figma.ui.onmessage = (msg) => {
	if (msg.type === "destroy-components") {
		const selection = [...figma.currentPage.selection];
		if (selection.length === 0) figma.notify(`Please select layers first`);
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
				});
			}
		}
		destroyComps(selection);
		const message = () => {
			const instances = updatedSelection.length;
			if (instances === 0) return `Nothing to destroy here`;
			if (instances === 1) return `❏  ${instances} instance was detached`;
			if (instances >= 1) return `❏  ${instances} instances were detached`;
		};
		figma.notify(message());
		figma.currentPage.selection = updatedSelection;
	}

	if (msg.type === "unstyle-elements") {
		const selection = [...figma.currentPage.selection];
		if (selection.length === 0) figma.notify(`Please select layers first`);
		let acc = [];

		const clearStyles = (node) => {
			if (node.type === "TEXT") {
				if (
					node.textStyleId !== "" ||
					node.effectStyleId !== "" ||
					node.fillStyleId !== "" ||
					node.strokeStyleId !== ""
				)
					acc = [...acc, node];
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
				if (
					node.gridStyleId !== "" ||
					node.effectStyleId !== "" ||
					node.fillStyleId !== "" ||
					node.strokeStyleId !== ""
				)
					acc = [...acc, node];
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
				if (
					node.effectStyleId !== "" ||
					node.fillStyleId !== "" ||
					node.strokeStyleId !== ""
				)
					acc = [...acc, node];
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
		const message = () => {
			const layers = acc.length;
			if (layers === 0) return `Nothing to destroy here`;
			if (layers === 1) return `❏  ${layers} layer was unstyled`;
			if (layers >= 1) return `❏  ${layers} layers were unstyled`;
		};
		figma.notify(message());
	}

	// figma.closePlugin();
};
