import {BX24} from 'bx24';
import {getQueryString} from './utils';
// eslint-disable-next-line no-restricted-globals
const bx24 = new BX24(window, parent);
window.bx24 = bx24;

export default new (class BX24API {
    constructor() {
        this.auth();
        const urlParams = new URLSearchParams(window.location.search);
        this.baseUrl = `https://${urlParams.get('DOMAIN')}`;
    }

    async auth() {
        if (this.session?.ACCESS_TOKEN) return this.session;
        this.session = await bx24.getAuth();
        return this.session;
    }

    async call(method, params = {}) {
        await this.auth();
        params.auth = this.session.ACCESS_TOKEN;

        const response = await fetch(this.baseUrl + `/rest/${method}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        });

        if (!response.ok) {
            const responseData = await response.json();
            if ('error' in responseData) {
                throw new Error(responseData['error_description']);
            } else {
                throw new Error('Connection error.');
            }
        }

        const responseData = await response.json();
        return responseData['result'];
    }

    async callBatch(payload, halt = 0) {
        return await this.call('batch',
            {'halt': halt, 'cmd': payload}
        );
    }
})();