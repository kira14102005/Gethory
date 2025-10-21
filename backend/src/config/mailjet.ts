import { Client, SendEmailV3_1, LibraryResponse } from 'node-mailjet';
import { MJ_APIKEY_PRIVATE, MJ_APIKEY_PUBLIC } from '../constants/env';

const mailjet = new Client({
  apiKey: MJ_APIKEY_PUBLIC,
  apiSecret: MJ_APIKEY_PRIVATE
});


export default mailjet;
