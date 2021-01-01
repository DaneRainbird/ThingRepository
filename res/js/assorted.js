function convertToB64() {
    var filesSelected = document.getElementById("imageInput").files;
        if (filesSelected.length > 0) {
            var fileToLoad = filesSelected[0];
            var fileReader = new FileReader();

            fileReader.onload = function(fileLoadedEvent) {
                var fileSize = document.getElementById('imageInput').files[0].size;
                fileSize = fileSize / 1024 / 1024;
                // Check filesize before anything else
                if (fileSize >= 120) {
                    alert("File is too large!");
                    document.getElementById('imageInput').files = null;
                    document.getElementById('imageInput').value = "";
                } else {
                    var srcData = fileLoadedEvent.target.result;
                    srcData = srcData.replace(/^data:image.+;base64,/, '');
                    document.getElementById("imageB64").value = srcData;
                } 
            }
        fileReader.readAsDataURL(fileToLoad);
    }
}  