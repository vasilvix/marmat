import { BX24 } from 'bx24';
// eslint-disable-next-line no-restricted-globals
const bx24 = new BX24(window, parent);
window.bx24 = bx24;

class BX24API {
    constructor() {
        this.auth();
        const urlParams = new URLSearchParams(window.location.search);
        this.baseUrl = `https://${urlParams.get('DOMAIN')}`;

        this.responsibleId = 2246;
        this.dealCategoryId = 48;
        this.rootSectionId = 7008;
        this.descriptionFieldName = 'PROPERTY_2134';
        this.imagePathFieldName = 'PROPERTY_1244';
        this.productQuantity = 'PROPERTY_1052';
        this.price = 'PROPERTY_1106';
    }

    async auth() {
        if (this.session?.ACCESS_TOKEN) return this.session;
        this.session = await bx24.getAuth();
        return this.session;
    }

    // code for local tests
    // async call(method, params = {}) {
    //     await this.auth();
    //     params.auth = this.session.ACCESS_TOKEN;

    //     const response = await fetch(this.baseUrl + `/rest/${method}`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(params),
    //     });

    //     if (!response.ok) {
    //         const responseData = await response.json();
    //         if ('error' in responseData) {
    //             throw new Error(responseData['error_description']);
    //         } else {
    //             throw new Error('Connection error.');
    //         }
    //     }

    //     const responseData = await response.json();
    //     return responseData['result'];
    // }

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
            { 'halt': halt, 'cmd': payload }
        );
    }

    async addMarmatOrder(items, comment) {
        const user = await this.call('user.current');
        const deliveryAddress = await this.fetchDeliveryAddress(user['ID']);
        const dealId = await this.call('crm.deal.add', {
            'fields':
            {
                'TITLE': `Заказ МАРМАТ от ${user['LAST_NAME']} ${user['NAME']}`,
                'TYPE_ID': 'GOODS',
                'OPENED': 'Y',
                'ASSIGNED_BY_ID': this.responsibleId,
                'CATEGORY_ID': this.dealCategoryId,
                'UF_CRM_CREATED_BY': user['ID'],
                'UF_CRM_3741729383355': deliveryAddress,
                'COMMENTS': comment
            }
        });
        const productRows = items.map(item => {
            return {
                'ownerId': dealId,
                'ownerType': 'D',
                'productId': item.id,
                'productName': item.name,
                'price': item.price,
                'quantity': item.amount,
                'taxRate': 0,
                'taxIncluded': 'Y'
            }
        });
        await this.call('crm.item.productrow.set', {
            'ownerType': 'D',
            'ownerId': dealId,
            'productRows': productRows
        });
        if (!!comment) {
            await this.call('crm.timeline.comment.add', {
                'fields': {
                    'ENTITY_ID': dealId,
                    'ENTITY_TYPE': 'deal',
                    'COMMENT': comment
                }
            });
        }
    }

    async fetchMarmatItems(sectionId) {
        const productResponse = await this.call('crm.product.list', {
            'filter': {
                'SECTION_ID': sectionId,
                'ACTIVE': 'Y'
            },
            'select': [
                'ID',
                'NAME',
                this.descriptionFieldName,
                this.imagePathFieldName,
                this.productQuantity,
                this.price,
            ]
        });
        const items = [];
        productResponse.forEach(e => {
            let imagesRaw = [];
            if (e[this.imagePathFieldName] !== null) {
                imagesRaw = e[this.imagePathFieldName];
            }
            items.push({
                id: e['ID'],
                name: e['NAME'],
                description: e[this.descriptionFieldName].value,
                productQuantity: parseInt(e[this.productQuantity].value),
                price: parseFloat(e[this.price].value),
                images: imagesRaw.map(i => i.value.showUrl),
            });
        });
        return items;
    }

    async fetchMarmatSections() {
        const sectionResponse = await this.call('crm.productsection.list', {
            'filter': {
                'SECTION_ID': this.rootSectionId,
                'ACTIVE': 'Y'
            },
            'select': [
                'ID', 'NAME'
            ]
        });
        const items = [];
        sectionResponse.forEach(e => {
            items.push({
                id: e['ID'],
                name: e['NAME'],
            });
        });
        return items;
    }

    async fetchDeliveryAddress(userId) {
        debugger;
        const employee = await this.call(
            'crm.item.list',
            {
                'entityTypeId': 185,
                'filter': {
                    'ufCrm99_1678714567': userId
                }
            });
        const prinBranch = await this.call(
            'crm.item.get',
            {
                'entityTypeId': 141,
                'id': employee['items'][0]['parentId141']
            }
        );
        const address = prinBranch['item']['ufCrm58_1666955726'];
        return address;
    }
}

const bx24Api = new BX24API()

export default bx24Api;
