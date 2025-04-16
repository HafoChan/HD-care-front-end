
export const AppID =  878850839;
export const ServerSecret = '49a4ea67ec8eff404a207dc2a79cdfee';


/**
 * Generate token
 *
 * Token = "04" + Base64.encode(expire_time + IV.length + IV + binary_ciphertext.length + binary_ciphertext)
 * Algorithm: AES<ServerSecret, IV>(token_json_str), using mode: CBC/PKCS5Padding
 *
 * This code example only provides a client-side token generation example. Please make sure to generate tokens on your own server to avoid leaking your ServerSecret.
**/