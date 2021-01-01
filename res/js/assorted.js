const compress = new Compress()
let uploadInput = document.getElementById("imageInput");

compress.attach('#imageInput', {
    size: 4,
    quality: .75
}).then((result) => {
    document.getElementById("imageB64").value = result[0].data;
})