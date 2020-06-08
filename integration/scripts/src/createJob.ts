// @ts-ignore
import url from 'url'
import {getArgs, getLoginCookie, registerPromiseHandler,} from './common'

const axios = require('axios')

async function main() {
    registerPromiseHandler();
    const args = getArgs(['CHAINLINK_URL']);

    await createJob({
        chainlinkUrl: args.CHAINLINK_URL,
    })
}

main();

interface Options {
    chainlinkUrl: string
}

async function createJob({chainlinkUrl}: Options) {
    const sessionsUrl = url.resolve(chainlinkUrl, '/sessions');
    const job = {
        initiators: [
            {
                type: 'external',
                params: {
                    name: "mock-client",
                    body: {
                        endpoint: process.argv[2],
                        addresses: [process.argv[3]]
                    }
                }
            }
        ],
        tasks: [{type: 'noop'}]
    };
    const specsUrl = url.resolve(chainlinkUrl, '/v2/specs');
    const Job = await axios.post(specsUrl, job, {
        withCredentials: true,
        headers: {
            cookie: await getLoginCookie(sessionsUrl)
        }
    }).catch((e: any) => {
        console.error(e);
        throw Error(`Error creating Job ${e}`)
    });

    console.log('Deployed Job at:', Job.data.data.id);
}
