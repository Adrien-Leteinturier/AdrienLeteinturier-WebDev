import { createContactHandler } from "../server/contact-core.mjs";

// Closed until an authenticated Firebase repository and automatic mail transport
// have been configured and tested. Never acknowledge an unstored submission.
export default createContactHandler();
