import { loadCSS } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const div = document.createElement('div');
  div.className = 'cmp-property-details-description';
  div.innerHTML = `
    <div class="property-details-description container">
      <div class="property-container">
        <div class="property-row">
          <div class="col col-12 col-lg-8">
            <div class="property-details-notes">
              <section class="cmp-property-details-notes" data-property-id="343140756">
                <div class="cmp-property-details-notes__content">
                  <div>
                    <section class="cmp-property-details-notes" id="propertyDetailsNotes">
                      <div class="cmp-property-details-notes__note-count">Your Notes
                        <!---->
                      </div>
                      <div tabindex="0" class="cmp-property-details-notes">
                        <!---->
                        <!---->
                        <li class="cmp-property-details-notes__result--zero">To add notes, please save this
                          property.</li>
                        <ul class="cmp-property-details-notes__result--entry"></ul>
                      </div>
                      <!---->
                      <!---->
                    </section>
                  </div>
                </div>
              </section>
            </div>
            <div class="horizontal-rule">
              <div class="cmp-background bg-transparent pt-3 pb-4   ">
                <div>
                  <section class="cmp-horizontal-rule">
                    <hr>
                  </section>
                </div>
              </div>
            </div>
            <div class="property-details-description__text">
              <p data-text-count class="collapsed">
                Presenting 38 Masconomo, a stunning Manchester manor that offers the perfect blend of classic and
                contemporary style. A dramatic entryway welcomes you to a palatial foyer with soaring ceilings, a
                grand double staircase and a stunning chef's kitchen complete with custom elmwood cabinets, a
                Sub-Zero fridge and freezer, 2 Thermador dishwashers, additional fridge and freezer drawers, and a
                six-burner Wolf gas range and oven. The beautiful second level offers 7 bedrooms, 6 of which with a
                walk-in closet, full en suite bathroom, and stunning ocean views. The second level also boasts a
                leisure and entertainment complex with a movie theater, billiard room, and sizable home gym. The
                exterior's salt water infinity pool and spa, outdoor kitchen and gazebo are perfect for entertaining
                and a fully outfitted cabana with full kitchen, bathroom, steam shower, sauna, and gas fireplace is
                the perfect place to kick back and relax. Lastly, enjoy your very own private beach with deeded
                rights.
              </p>
              <a href="#" rel="noopener" data-more-btn=""
                class="property-details-description__more d-lg-none hidden d-block">View More</a>
            </div>
          </div>
          <div class="col d-lg-block col-lg-4 pt-lg-0  ">
            <span class="d-none"></span>
            <div class="contact-card">
              <section class="cmp-contact-card afix">
                <div class="property-container property-row p-0 m-auto"
                  data-lead-source="[{&quot;source&quot;:&quot;https://ma312.bhhs.hsfaffiliates.com/profile/card#me&quot;,&quot;recipientId&quot;:&quot;https://ma312.bhhs.hsfaffiliates.com/profile/card#me&quot;,&quot;recipientName&quot;:&quot;Commonwealth Real Estate&quot;,&quot;recipientType&quot;:&quot;organization&quot;,&quot;coListing&quot;:true,&quot;agentType&quot;:&quot;Primary&quot;,&quot;price&quot;:1.4995E7,&quot;priceCurrency&quot;:&quot;USD&quot;,&quot;postalCode&quot;:&quot;01944&quot;,&quot;addressRegion&quot;:&quot;MA&quot;,&quot;addressCountry&quot;:&quot;US&quot;,&quot;streetAddress&quot;:&quot;38 Masconomo St, Manchester, MA 01944&quot;,&quot;addressLocality&quot;:&quot;Manchester&quot;,&quot;mlsId&quot;:&quot;73084552&quot;,&quot;mlsName&quot;:&quot;MLSPIN - MLS Property Information Network&quot;,&quot;mlsKey&quot;:&quot;73084552&quot;,&quot;listAor&quot;:&quot;mamlspin&quot;}]">
                  <div class="data-fields w-100 d-flex align-items-start">
                    <div class="data-fields-item mr-3">
                      <h2 class="cmp-contact-card__title">
                        Berkshire Hathaway HomeServices<br>Commonwealth Real Estate
                      </h2>
                      <hr class="cmp-contact-card__separator">
                      <div class="cmp-contact-card-data-contact">
                        <div class="cmp-contact-card-data-contact__mail">
                          <a class="text-lowercase cmp-contact-card-data-contact__mail-link"
                            href="#">realestateinquiry@commonmoves.com</a>
                        </div>
                        <div class="cmp-contact-card-data-contact__phone">
                          <a href="tel:508.810.0700">508.810.0700</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="property-row cmp-contact-card__btn-group property-container m-sm-0 p-0 col col-lg-6">
                    <div class="col col-6 col-md-3 col-lg-12 pl-1 pr-1 pt-1 pb-1 order-lg-2 pl-lg-0 see-property">
                      <div class="cmp-cta">
                        <a class="cmp-cta-btn btn-see-property " href="#" rel="noopener">
                          <span class="cmp-cta__btn-text">
                            See the property
                          </span>
                        </a>
                      </div>
                    </div>
                    <div class="col col-6 col-md-3 col-lg-12 pl-1 pr-1 pt-1 pb-1 order-lg-3 pl-lg-0 offer">
                      <div class="cmp-cta">
                        <a class="cmp-cta-btn btn-make-offer" href="#" rel="noopener">
                          <span class="cmp-cta__btn-text">
                            make an offer
                          </span>
                        </a>
                      </div>
                    </div>
                    <div class="col col-lg-12 pl-2 pr-2 pt-3 pb-3 pt-lg-1 pb-lg-1 sticky order-lg-1 pl-lg-0  ">
                      <div class="cmp-cta">
                        <a class="cmp-cta-btn btn-contact d-none d-lg-block" href="#" rel="noopener">
                          <span class="cmp-cta__btn-text">
                            contact
                          </span>
                        </a>
                      </div>
                      <!-- <sly data-sly-test="" data-sly-call="" /> -->
                      <!-- Mobile button -->
                      <div class="cmp-cta">
                        <a class="cmp-cta-btn btn-contact d-block d-lg-none " href="#" rel="noopener">
                          <span class="cmp-cta__btn-text">
                            contact
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  block.append(div);
  
  window.addEventListener('scroll', () => {
    const contactCard = block.querySelector('.cmp-contact-card.afix');
    const header = document.querySelector('header');
    var height = header.offsetHeight;
    //var mainSection = document.querySelector('.section');
    var currentSection = document.querySelector('.property-details-description-wrapper');
    while(currentSection = currentSection.previousElementSibling) {
      height += currentSection.offsetHeight;
    }
    if(window.pageYOffset > height) {
      contactCard.classList.add('stickable');
    } else {
      contactCard.classList.remove('stickable');
    }
  });
  loadCSS(`${window.hlx.codeBasePath}/styles/property-details.css`);
}