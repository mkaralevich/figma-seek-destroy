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


<div class="wrapper p-xxsmall">

	<Label>Exclude pattern</Label>
	<Input bind:value={pattern} class="mb-xxsmall" />

	<div class="flex p-xxsmall mb-xsmall">
		<Button on:click={cancel} variant="secondary" class="mr-xsmall">Cancel</Button>
		<Button on:click={destroyComps} class="mr-xsmall">Destroy</Button>
		<Button on:click={unstyleEls}>Unstyle</Button>
	</div>

</div>


<style>

</style>