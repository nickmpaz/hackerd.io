module.exports = {
    getLocalFileContents: function () {
        return new Promise((resolve) => {
            var input = document.createElement("input");
            input.type = "file";

            input.onchange = (e) => {
                // getting a hold of the file reference
                var file = e.target.files[0];

                // setting up the reader
                var reader = new FileReader();
                reader.readAsText(file, "UTF-8");

                // here we tell the reader what to do when it's done reading...
                reader.onload = (readerEvent) => {
                    var content = readerEvent.target.result;
                    resolve(JSON.parse(content))
                }
            };

            input.click();
        })
    },
    downloadObj: function (obj, name) {

        const data = JSON.stringify(obj)
        const blob = new Blob([data], {
            type: 'text/plain'
        })
        const e = document.createEvent('MouseEvents'),
            a = document.createElement('a');
        a.download = name + ".json";
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
        e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
    },
    openInNewTab: function (url) {
        var win = window.open(url, "_blank");
        win.focus();
    },
    copyTextToClipboard: function (text) {
        console.log("fired");
        if (!navigator.clipboard) {
            var textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.position = "fixed";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                var successful = document.execCommand("copy");
                var msg = successful ? "successful" : "unsuccessful";
                console.log("Fallback: Copying text command was " + msg);
            } catch (err) {
                console.error("Fallback: Oops, unable to copy", err);
            }
            document.body.removeChild(textArea);
            return;
        }
        navigator.clipboard.writeText(text).then(
            function () {
                console.log("Async: Copying to clipboard was successful!");
            },
            function (err) {
                console.error("Async: Could not copy text: ", err);
            }
        );
    },
}