figma.showUI(__html__, { width: 320, height: 96 });

figma.ui.onmessage = (msg) => {
	if (msg.type === "destroy-components") {
		const selection = [...figma.currentPage.selection];
		if (selection.length === 0) figma.notify(`Please select layers first`);
		let instanceSelection = [];
		let componentSelection = [];

		function destroyComps(nodes) {
			if (Array.isArray(nodes)) {
				return nodes.map((child) => {
					if (child.type === "INSTANCE" && !child.removed) {
						const detached = child.detachInstance();
						instanceSelection = [...instanceSelection, detached];
						if (detached.children) destroyComps(detached.children);
					}
					if (child.type !== "INSTANCE" && child.type !== "COMPONENT") {
						if (child.children) destroyComps(child.children);
					}
					if (child.type === "COMPONENT") {
						componentSelection = [...componentSelection, child];
					}
				});
			}
		}
		destroyComps(selection);

		const instanceMessage = () => {
			const components = componentSelection.length;
			const instances = instanceSelection.length;
			const plural = (arr) => (arr <= 1 ? "" : "s");

			if (instances === 0 && components >= 1)
				return `${components} component${plural(components)} found`;

			if (instances >= 1 && components >= 1) {
				return (
					`❏  ${instances} instance${plural(instances)} detached` +
					`, ${components} component${plural(components)} found`
				);
			}

			if (instances >= 1)
				return `❏  ${instances} instance${plural(instances)} detached`;

			if (instances === 0) return `Nothing to destroy here`;
		};
		figma.notify(instanceMessage());
		figma.currentPage.selection = instanceSelection;
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
