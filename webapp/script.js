let session = "";   

$("#createsession").on('click', async () => {
    const req = await fetch(`/createSession?url=${encodeURIComponent($("#url").val())}`, {method:'POST'}).then(data=>data.json());
    const id = req.session;

    session = id;
    $("#session-id").text(id);
    console.log(id);
});

$("#kill").on('click', async () => {
    const req = await fetch(`/kill?session=${encodeURIComponent(session)}`, {method:'POST'});
    session = "";
    $("#session-id").text("not connected");
});

$("#getscreenshot").on('click', async (req, res) => {
    $("#screenshot").attr("src", `/screenshot?session=${encodeURIComponent(session)}&t=${Math.random()}`);
});

$("#screenshot").on('click', async (e) => {
    const x = e.offsetX;
    const y = e.offsetY;

    if (confirm(`click at ${x}, ${y}?`)) {
        await fetch(`/click?session=${encodeURIComponent(session)}&x=${x}&y=${y}`, {method:'POST'});
        $("#screenshot").attr("src", `/screenshot?session=${encodeURIComponent(session)}&t=${Math.random()}`);
    }
})

$("#type").on('click', async () => {
    const text = prompt("text to type?");

    await fetch(`/type?session=${encodeURIComponent(session)}&text=${encodeURIComponent(text)}`, {method:'POST'});
    $("#screenshot").attr("src", `/screenshot?session=${encodeURIComponent(session)}&t=${Math.random()}`);
});

$("#enter").on('click', async () => {

    await fetch(`/enter?session=${encodeURIComponent(session)}`, {method:'POST'});
    $("#screenshot").attr("src", `/screenshot?session=${encodeURIComponent(session)}&t=${Math.random()}`);
});

$("#backspace").on('click', async () => {

    await fetch(`/backspace?session=${encodeURIComponent(session)}`, {method:'POST'});
    $("#screenshot").attr("src", `/screenshot?session=${encodeURIComponent(session)}&t=${Math.random()}`);
});