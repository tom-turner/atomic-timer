<script>
	export let onLoad;
	export let page;
	let fileInput;
	let files;
	let compressedBase64;

	const uploadPhoto = () => {
		fetch('/api/upload-photo', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				imageString: compressedBase64,
				slug: page.slug
			})
		}).then(async (res) => {
			const body = await res.json();
			if (res.status !== 200) return alert(body.message || res.statusText);
		});
	};

	const getBase64 = (image) => {
		const reader = new FileReader();
		reader.readAsDataURL(image);
		reader.onload = (e) => {
			const img = new Image();
			img.src = e.target.result;
			img.onload = () => {
				const elem = document.createElement('canvas');
				const width = 1280;
				const scaleFactor = img.width / width;
				elem.width = width;
				elem.height = img.height / scaleFactor;
				const ctx = elem.getContext('2d');
				// img.width and img.height will contain the original dimensions

				ctx.drawImage(img, 0, 0, width, img.height / scaleFactor);
				compressedBase64 = ctx.canvas.toDataURL('image/webp');
				onLoad(compressedBase64);
				uploadPhoto();
			};
		};
	};
</script>

<button
	on:click={() => {
		fileInput.click();
	}}
	title="Upload Page Photo"
	class=" rounded-full bg-white bg-opacity-50 dark:bg-neutral-700 dark:text-neutral-100 px-2 text-xs font-semibold shadow-inner flex items-center justify-center truncate"
>
	✏️
</button>

<form action="/uploadPhoto" method="post" enctype="multipart/form-data" class="z-50 hidden">
	<input
		bind:files
		bind:this={fileInput}
		on:change={() => getBase64(files[0])}
		type="file"
		name="fileToUpload"
		id="fileToUpload"
		class="hidden"
		accept=".png,.jpg,.webp,.svg"
	/>
	<input type="submit" value="Upload Image" name="submit" />
</form>
