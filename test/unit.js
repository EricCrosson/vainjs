import test from 'ava';
// For some reason AVA can't `import` bitcoin so `require` for now.
// import bitcoin from 'bitcoinjs-lib';
import Vain from '..';

const bitcoin = require('bitcoinjs-lib');

test('Vain is exported', t => {
	t.not(Vain, undefined);
});

test('Vain derives a p2pkh vanity address', async t => {
	const options = {
		addressFormat: 'p2pkh',
		prefix: 'A'
	};
	const vain = new Vain(options);
	const {address, wif} = await vain.start();

	const keyPair = bitcoin.ECPair.fromWIF(wif);
	const {address: wifAddress} = bitcoin.payments.p2pkh({pubkey: keyPair.publicKey});

	t.true(address.startsWith(`1${options.prefix}`));
	t.is(address, wifAddress);
});

test('Vain derives a p2wpkh-p2sh vanity address', async t => {
	const options = {
		addressFormat: 'p2wpkh-p2sh',
		prefix: 'A'
	};
	const vain = new Vain(options);
	const {address, wif} = await vain.start();

	const keyPair = bitcoin.ECPair.fromWIF(wif);
	const {address: wifAddress} = bitcoin.payments.p2sh({
		redeem: bitcoin.payments.p2wpkh({pubkey: keyPair.publicKey})
	});

	t.true(address.startsWith(`3${options.prefix}`));
	t.is(address, wifAddress);
});
