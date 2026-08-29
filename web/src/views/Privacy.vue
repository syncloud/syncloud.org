<template>
  <div>
    <section
      class="sc-hero sc-hero-compact"
    >
      <div class="sc-container">
        <h1>{{ $t('privacy.heading') }}</h1>
      </div>
    </section>

    <section
      class="sc-section sc-section-compact"
    >
      <div
        class="sc-container sc-prose"
        style="max-width:820px"
      >
        <p>Syncloud is built by Syncloud Ltd. The platform itself is open source and free to download and run on your own hardware. The account service at syncloud.it, which gives a device a domain name and a certificate, is a paid subscription after a free trial, and assembled devices are sold. This policy covers the syncloud.org website and the syncloud.it account service.</p>
        <p>This page is used to inform visitors regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service.</p>
        <p>If you choose to use our Service, then you agree to the collection and use of information in relation to this policy. The Personal Information that we collect is used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy.</p>
        <p>The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which is accessible at Syncloud unless otherwise defined in this Privacy Policy.</p>

        <h2 class="sc-h2">
          Information Collection and Use
        </h2>
        <p>To give a device a domain name we need an email address for the account and the IP address the device reports, so that the name resolves to it. If you buy a device we need a delivery address. This is kept for as long as the account exists and used for nothing else.</p>
        <p>Payments are taken by PayPal and Stripe. We do not see or store card details; they do, under their own policies.</p>

        <h2 class="sc-h2">
          Log Data
        </h2>
        <p>Our servers keep ordinary request logs, which include the IP address a request came from, the time, and what was asked for. A device that has been activated reports its address so its domain name keeps working, and its platform version so we know what is in use.</p>
        <p>The website counts how many people reach each step of the setup guide and which images are downloaded. These counts carry no identifier and nothing that could single anyone out, and are not shared with anyone.</p>

        <h2 class="sc-h2">
          Cookies
        </h2>
        <p>The account service sets one cookie when you log in, to keep you logged in. Refusing it means you cannot sign in.</p>
        <p>If you arrive from one of our adverts, the website stores the click identifier that Google adds to the link in your browser, for ninety days, so that we can tell whether an advert led to a device being set up. It is not a cookie and it is not sent anywhere except back to us when you download an image. Clearing your browser storage removes it.</p>
        <p>The website itself uses no advertising or analytics service run by anyone else.</p>

        <h2 class="sc-h2">
          Service Providers
        </h2>
        <p>We use a small number of other companies to run the service:</p>
        <ul>
          <li>PayPal and Stripe, to take payment;</li>
          <li>Amazon Web Services, to host the account service, hold the domain names and send email.</li>
        </ul>
        <p>They handle only what they need to do that job, under their own policies, and are not permitted to use it for anything else.</p>

        <h2 class="sc-h2">
          Security
        </h2>
        <p>We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.</p>

        <h2 class="sc-h2">
          Links to Other Sites
        </h2>
        <p>This Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.</p>

        <h2 class="sc-h2">
          Children's Privacy
        </h2>
        <p>This service is not aimed at anyone under 13 and we do not knowingly collect information from them. If we find that we have, we delete it. If you are a parent or guardian and believe your child has given us information, contact us and we will remove it.</p>

        <h2 class="sc-h2">
          Changes to This Privacy Policy
        </h2>
        <p>We may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately after they are posted on this page.</p>

        <h2 class="sc-h2">
          Contact Us
        </h2>
        <p>Ask us anything about this policy, or ask us to delete what we hold, at <a href="mailto:support@syncloud.it">support@syncloud.it</a>. Deleting your account removes your email address and your devices' records from our servers.</p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'PrivacyView'
}
</script>
