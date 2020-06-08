// @ts-ignore
import url from 'url'
import {getArgs, getLoginCookie, registerPromiseHandler,} from './common'

const axios = require('axios')

async function main() {
    registerPromiseHandler();
    const args = getArgs(['CHAINLINK_URL', 'EXTERNAL_INITIATOR_URL']);

    await addExternalInitiator({
        chainlinkUrl: args.CHAINLINK_URL,
        initiatorUrl: args.EXTERNAL_INITIATOR_URL,
    })
}

main();

interface Options {
    chainlinkUrl: string
    initiatorUrl: string
}

async function addExternalInitiator({
                                        initiatorUrl,
                                        chainlinkUrl,
                                    }: Options) {
    const sessionsUrl = url.resolve(chainlinkUrl, '/sessions');
    const externalInitiatorsUrl = url.resolve(chainlinkUrl, '/v2/external_initiators');
    const externalInitiator = await axios.post(externalInitiatorsUrl,
        {
            name: "mock-client",
            url: url.resolve(initiatorUrl, "/jobs")
        },
        {
            withCredentials: true,
            headers: {
                Cookie: await getLoginCookie(sessionsUrl)
            }
        }
    ).catch((e: any) => {
        console.error(e);
        throw Error(`Error creating EI ${e}`)
    });

    console.log(`EI incoming accesskey: ${externalInitiator.data.data.attributes.incomingAccessKey}`);
    console.log(`EI incoming secret: ${externalInitiator.data.data.attributes.incomingSecret}`);
    console.log(`EI outgoing token: ${externalInitiator.data.data.attributes.outgoingToken}`);
    console.log(`EI outgoing secret: ${externalInitiator.data.data.attributes.outgoingSecret}`)
}
