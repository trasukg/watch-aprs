# watch-aprs

Monitor and decode APRS packets arriving on a KISS-over-TCP device.

This is a command-line utility that decodes APRS packets and prints them 
out to the console in more-or-less human-readable form.  It's useful with 
ports that have been made available by the share-tnc utility, or with ports
that directly implement KISS-over-TCP, like the Direwolf sound card interface.

# Hardware/Software Environment

watch-aprs uses 'node.js'.  It has been tested most
heavily on a Raspberry Pi running Raspbian Jessie, but has been casually tested on
Windows 10, Linux Mint and MacOS Sierra, and appears to work fine.  Please file a
report if you experience difficulties.

# Installation

If you need to use 'sudo' to install globally, use
the following:

    sudo npm install -g watch-aprs

If you don't need 'sudo', then

    npm install -g watch-aprs

# Usage

## Command Line - Monitoring the On-Air APRS Traffic

    watch-aprs <host>:<port>

    e.g.

    watch-aprs raspberrypi:8001

'watch-aprs' isn't specific to the 'share-tnc' package.  It will work with any
KISS-over-TCP server (e.g. DireWolf).

# Contributing  

To contribute, please fork https://github.com/trasukg/watch-aprs and then submit
pull requests, or open an issue.

See also https://github.com/trasukg/utils-for-aprs for the underlying components
used in this utility.

# License

This software is licensed under the Apache Software License 2.0

The phrase APRS is a registered trademark of Bob Bruninga WB4APR.

# Release Notes

1.0.0 - December 21, 2017 - First release.  Previously was a part of the 
share-tnc package.  Releasing separately allows installation of watch-aprs
without the serialport package.
