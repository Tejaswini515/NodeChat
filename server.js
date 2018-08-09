const net = require('net');
const readline = require('readline');
const crypto = require('crypto');
let serverSecret;
let decrypted_msg;
let encrypted_msg;
let count = 0 ;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const server1 = crypto.createECDH('secp521r1');
const serverKey = server1.generateKeys();

const server = net.createServer((l)=>{
    console.log('Connection Established');
	l.write(serverKey);
	    
    l.on('end',()=> {
		console.log('Connection Ended');
    });   

const recursiveAsyncReadLine = function () {
  rl.question('server: ', function (answer) {
	  
    if (answer == 'exit')
	{ 
      return rl.close();
	}
		
		encrypted_msg = cipher(answer);
		l.write(encrypted_msg);

    recursiveAsyncReadLine();
  });
};

recursiveAsyncReadLine(); 
    l.on('data',function(data){
		if(count==0)
		{
			serverSecret = server1.computeSecret(data);
			count++;
			//console.log(serverSecret);
		}
		else
		{
			decrypted_msg = decipher(data.toString());
			var msg = decrypted_msg.charAt(0).toUpperCase()+decrypted_msg.slice(1);
			encrypted_msg = cipher(msg);
			l.write(encrypted_msg);
			console.log('client: ',decrypted_msg);
		}
    });
});

const cipher = (data) =>{
    let cipher = crypto.createCipher('aes192',serverSecret);
    let mystr = cipher.update(data, 'utf8', 'hex');
    mystr += cipher.final('hex');
    return mystr;
}

const decipher = (data) => {
    let decipher = crypto.createDecipher('aes192',serverSecret);
    let mystr = decipher.update(data, 'hex', 'utf8');
    mystr += decipher.final('utf8');
     return mystr;
}

server.listen(8000,()=> {
console.log('Server Running');
});
