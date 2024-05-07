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
    const unsaveModal = document.createElement('div');
    unsaveModal.innerHTML = `<div class="cmp-confirmation-modal">
    <div class="cmp-form-loader">
       <div class="cmp-form-loader__content">
          <div class="message">Are you sure you want to unsave this property?</div>
          <div class="confirmation-modal-buttons">
             <section class="cmp-cta modal-cta mr-2"><a rel="noopener noreferrer" href="javascript:void(0)" tabindex="" class="btn btn-primary" role="button"><span class="cmp-cta__btn-text">
                Unsave
                </span></a>
             </section>
             <section class="cmp-cta modal-cta cancel-button"><a rel="noopener noreferrer" href="javascript:void(0)" tabindex="" class="btn btn-secondary" role="button"><span class="cmp-cta__btn-text">
                cancel
                </span></a>
             </section>
          </div>
       </div>
    </div>
 </div>
 <div class="cmp-confirmation-modal__overlay"></div>`;
    block.append(unsaveModal);

    // click event property-list-cards aria-label="Save"
    const saveButtons = document.querySelectorAll('.saved-properties .button-property .icon-heartfilled');
    console.log('saveButtons',saveButtons);
    saveButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const confirmationModal = block.querySelector('.cmp-confirmation-modal');
            confirmationModal.classList.add('open');
            const $body = document.querySelector('body');
            $body.classList.add('modal-open');
        });
    });

    // onclick of cancel-button close the modal
    const cancelButton = block.querySelector('.cancel-button');
    cancelButton.addEventListener('click', (e) => {
        e.preventDefault();
        const confirmationModal = block.querySelector('.cmp-confirmation-modal');
        confirmationModal.classList.remove('open');
        const $body = document.querySelector('body');
        $body.classList.remove('modal-open');
    });
    
}