import { loadCSS } from '../../scripts/aem.js';
import { renderSavedProperties as renderCards } from '../property-listing/cards/cards.js';
import { getUserDetails } from '../../scripts/apis/user.js';
export default async function decorate(block) {
    const user = await getUserDetails();
    if (!user) {
        return;
    }
    const contactKey = user.contactKey;
    await renderCards(contactKey, block);
}