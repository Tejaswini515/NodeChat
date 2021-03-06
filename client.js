const net = require('net');
const readline = require('readline');
const crypto = require('crypto');
let clientSecret;
let decrypted_msg;
let encrypted_msg;
let count = 0;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const client1 = crypto.createECDH('secp521r1');
const clientKey = client1.generateKeys();


const client = net.createConnection({port:8000},()=>{
  console.log('Connection made with server');
  client.write(clientKey);

	client.on('end',()=> {
		console.log('Connection Ended');
	});
 
  const recursiveAsyncReadLine = function () {
  rl.question('client: ', function (answer) {

  if (answer == 'exit') 
   {
      client.end();
      return rl.close();
   } 
  
      encrypted_msg = cipher(answer);
	  client.write(encrypted_msg);
 
    recursiveAsyncReadLine(); 
  });
};

recursiveAsyncReadLine(); 
         client.on('data',(data)=>{
			if(count==0)
		{
			clientSecret = client1.computeSecret(data);
			count++;
			//console.log(clientSecret);
		}
		else
		{
			decrypted_msg = decipher(data.toString());
			console.log('server: ',decrypted_msg);	
		}
    });   
});

const cipher = (data) => {
    let cipher = crypto.createCipher('aes192',clientSecret);
    let mystr = cipher.update(data, 'utf8', 'hex');
    mystr += cipher.final('hex');
    return mystr;
}

const decipher = (data) => {
    let decipher = crypto.createDecipher('aes192',clientSecret);
    let mystr = decipher.update(data, 'hex', 'utf8');
    mystr += decipher.final('utf8');
     return mystr;
}


    
