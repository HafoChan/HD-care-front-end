
export const AppID =  1131513936;
export const ServerSecret = '7d56c0d78cd020348dafd438a86bc706';


/**
 * Generate token
 *
 * Token = "04" + Base64.encode(expire_time + IV.length + IV + binary_ciphertext.length + binary_ciphertext)
 * Algorithm: AES<ServerSecret, IV>(token_json_str), using mode: CBC/PKCS5Padding
 *
 * This code example only provides a client-side token generation example. Please make sure to generate tokens on your own server to avoid leaking your ServerSecret.
**/