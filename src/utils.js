
export const AppID =  1198054191;
export const ServerSecret = 'e4060b5f9cd769fe9019a333ec506a13';


/**
 * Generate token
 *
 * Token = "04" + Base64.encode(expire_time + IV.length + IV + binary_ciphertext.length + binary_ciphertext)
 * Algorithm: AES<ServerSecret, IV>(token_json_str), using mode: CBC/PKCS5Padding
 *
 * This code example only provides a client-side token generation example. Please make sure to generate tokens on your own server to avoid leaking your ServerSecret.
**/