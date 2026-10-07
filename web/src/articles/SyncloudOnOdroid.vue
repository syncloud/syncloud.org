<template>
  <div>
    <p>
      Cloud storage is convenient until the provider changes the price, changes the terms, or goes away and takes
      your files with it. The alternative is not complicated: a small computer of your own that holds your files,
      photos and passwords, and that you can reach from anywhere.
    </p>
    <p>
      An ODROID is a good computer for that. Syncloud is the software that turns it into one without a weekend of
      system administration.
    </p>

    <h2>What you get</h2>
    <p>
      Syncloud is to a server of your own roughly what Android is to a phone: the system plus an app store. You install
      apps in one click and Syncloud keeps them updated:
    </p>
    <ul>
      <li>Nextcloud for files, calendar and contacts</li>
      <li>Bitwarden for passwords</li>
      <li>Jellyfin for films and music</li>
      <li>Immich or Photoprism for photos</li>
      <li>Home Assistant for the house</li>
      <li>
        and <a href="https://store.syncloud.org">over 40 more</a>
      </li>
    </ul>
    <p>
      Every app gets its own HTTPS address, they all share one login, and backups are built in. Your data stays
      on the device.
    </p>
    <img
      src="/images/screenshot/app-store.webp"
      alt="The Syncloud app store, showing apps that install in one click"
      loading="lazy"
    >

    <h2>Which ODROID</h2>
    <p>Two boards cover most people.</p>
    <p>
      <strong>ODROID-H5</strong>, if you want real capacity. It is an ordinary Intel machine with an N300
      processor and four M.2 slots, which take NVMe drives or adapters for SATA disks. Build it out in a case with
      two or more drives and it is a server you will not outgrow quickly. It is the dearer of the two once
      memory and storage are added.
    </p>
    <p>
      <strong>ODROID-M1S</strong>, if you want to start small. It is an ARM board with storage built in and an
      M.2 slot for an NVMe drive. It costs much less, uses very little power, and is plenty for files, passwords
      and photos for a household, as long as you keep a backup somewhere else.
    </p>
    <p>
      In the United States both are sold by ameriDroid:
      <a
        href="https://ameridroid.com/products/odroid-h5?utm_source=syncloud.org"
        data-testid="article-link-h5"
        @click="track('outbound.ameridroid')"
      >ODROID-H5</a>
      and
      <a
        href="https://ameridroid.com/products/odroid-m1s?utm_source=syncloud.org"
        data-testid="article-link-m1s"
        @click="track('outbound.ameridroid')"
      >ODROID-M1S</a>.
      For other countries see
      <router-link
        to="/hardware"
        data-testid="article-link-hardware"
      >
        where to buy the hardware
      </router-link>.
    </p>

    <h2>Install it</h2>
    <ol>
      <li>
        Open
        <router-link
          to="/setup"
          data-testid="article-link-setup"
        >
          Setup
        </router-link>,
        choose "Build it yourself" and pick your board: PC for the ODROID-H5, ODROID-M1S for the M1S.
      </li>
      <li>Download the image and write it to the drive the board will start from.</li>
      <li>Connect the board to your router with an ethernet cable and power it on.</li>
      <li>Open the device address in a browser, choose a name and a password, and install your first app.</li>
    </ol>
    <p>The page walks through each step, and the whole thing takes about a quarter of an hour.</p>

    <h2>What it costs</h2>
    <p>
      The software is free and open source, and the device keeps running with its apps and your data whatever
      happens. A subscription, £7 a month after a free first month, pays for the services around it: the address
      of your device, its certificate, a relay for networks that block direct access, and support.
      <router-link
        to="/faq"
        data-testid="article-link-faq"
      >
        The FAQ
      </router-link>
      says exactly what happens without it.
    </p>

    <h2>Reality check</h2>
    <p>
      The ODROID-H5 uses the same PC image as every other Intel or AMD machine, which is what more than half of
      Syncloud devices run on today.
    </p>
    <p>
      The ODROID-M1S image is new. It is built on Armbian's mainline kernel, and we are still collecting reports
      from first installs. If you try it, tell us how it went on
      <a href="https://syncloud.discourse.group">the forum</a>.
    </p>
  </div>
</template>

<script>
import { track } from '../track'

export default {
  name: 'SyncloudOnOdroid',
  methods: {
    track (event) {
      track(event)
    }
  }
}
</script>
