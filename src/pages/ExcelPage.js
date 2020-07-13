import { Page } from '@core/Page';
import { createStore } from '@core/store/createStore';
import { rootReducer } from '@/redux/rootReducer';
import { storage, debounce } from '@core/utils';
import { Excel } from '@/components/excel/Excel';
import { Header } from '@/components/header/Header';
import { Toolbar } from '@/components/toolbar/Toolbar';
import { Table } from '@/components/table/Table';
import { Formula } from '@/components/formula/Formula';
import { normalizeInitialState } from '@/redux/initialState';

function storageName(param) {
    return 'excel:' + param
}

export class ExcelPage extends Page {

    excel;

    getRoot() {

        const params = this.params
            ? this.params
            : Date.now().toString();

        const storageState = storage(storageName(params));

        const store = createStore(rootReducer, normalizeInitialState(storageState));

        const stateListener = debounce((state) => {
            storage(storageName(params), state);
        }, 300);

        store.subscribe(stateListener)

        this.excel = new Excel({
            components: [Header, Toolbar, Formula, Table],
            store
        });

        return this.excel.getRoot();
    }

    afterRender() {
        this.excel.init();
    }

    destroy() {
        this.excel.destroy();
    }
}
