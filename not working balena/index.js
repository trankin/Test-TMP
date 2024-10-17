// in ES6
import { NFC, CONNECT_MODE_DIRECT } from 'nfc-pcsc';

const nfc = new NFC(); // optionally you can pass logger

let success = false;
nfc.on('reader', async reader => {

	console.log(`${reader.reader.name}  device attached`);
	try {
		await reader.connect(CONNECT_MODE_DIRECT);
		await reader.setBuzzerOutput(false);
		await reader.disconnect();
	} catch (err) {
		console.log(`initial sequence error`, reader, err);
	}
	// enable when you want to auto-process ISO 14443-4 tags (standard=TAG_ISO_14443_4)
	// when an ISO 14443-4 is detected, SELECT FILE command with the AID is issued
	// the response is available as card.data in the card event
	// see examples/basic.js line 17 for more info
	// reader.aid = 'F222222222';

	reader.on('card', async card => {

		// card is object containing following data
		// [always] String type: TAG_ISO_14443_3 (standard nfc tags like MIFARE) or TAG_ISO_14443_4 (Android HCE and others)
		// [always] String standard: same as type
		// [only TAG_ISO_14443_3] String uid: tag uid
		// [only TAG_ISO_14443_4] Buffer data: raw data from select APDU response
		// red error
		//await reader.led(0b01011101, [0x02, 0x01, 0x05, 0x01]);

		// green success
		setTimeout(async () => {
			try {
				success = !success;
				if(success) {
					await reader.led(0b00101110, [0x01, 0x00, 0x01, 0x01]);
					await reader.led(0b00101110, [0x01, 0x00, 0x01, 0x01]);
					await reader.led(0b00101110, [0x01, 0x00, 0x01, 0x01]);
				} else {
					await reader.led(0b01011101, [0x02, 0x01, 0x05, 0x01]);
				}
			} catch(e) {}
		}, 1000);
		console.log(`${reader.reader.name}  card detected`, card);
        // Make the device beep
        // reader.transmit(Buffer.from([0xFF, 0x00, 0x40, 0xA0, 0x01, 0x01]), 40)
        //     .then(response => {
        //         console.log('Beep command sent successfully', response);
        //     })
        //     .catch(err => {
        //         console.error('Error sending beep command', err);
        //     });

        // // Change the light (example command, may vary based on device)
        // reader.transmit(Buffer.from([0xFF, 0x00, 0x40, 0xA1, 0x01, 0x01]), 40)
        //     .then(response => {
        //         console.log('Light change command sent successfully', response);
        //     })
        //     .catch(err => {
        //         console.error('Error sending light change command', err);
        //     });
	});

	reader.on('card.off', card => {
		console.log(`${reader.reader.name}  card removed`, card);
	});

	reader.on('error', err => {
		console.log(`${reader.reader.name}  an error occurred`, err);
	});

	reader.on('end', () => {
		console.log(`${reader.reader.name}  device removed`);
	});

});

nfc.on('error', err => {
	console.log('an error occurred', err);
});