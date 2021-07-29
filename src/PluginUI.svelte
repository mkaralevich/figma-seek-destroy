<script>
	import { GlobalCSS } from 'figma-plugin-ds-svelte';
	import { Button, Input, Label, SelectMenu } from 'figma-plugin-ds-svelte';

	let pattern = ""

	function destroyComps() {
		parent.postMessage({
			pluginMessage: {
				'type': 'destroy-components',
				'pattern': pattern
			}
		}, '*');
	}
	function unstyleEls() {
		parent.postMessage({
			pluginMessage: {
				'type': 'unstyle-elements',
			}
		}, '*');
	}

	function cancel() {
		parent.postMessage({ pluginMessage: { 'type': 'cancel' } }, '*')
	}

</script>

<style>
	.flex-gap {
		gap: 8px
	}
</style>

<div class="wrapper p-xsmall">
	<div class="flex p-xxsmall mb-xsmall flex-grow flex-gap">
		<Button on:click={destroyComps} class="justify-content-center flex-grow">Destroy Instances</Button>
		<Button on:click={unstyleEls} class="justify-content-center flex-grow">Unstyle Layers</Button>
	</div>
</div>