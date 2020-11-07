import Dexie from 'dexie';

interface Posts {
    id?: number;
    linkedin_id: string;
    classify: string;
    finished: number;
    date: Date;
}

interface ToolBarInterface {
    id?: number;
    show: boolean;
}

class Linvo extends Dexie {
    public posts: Dexie.Table<Posts, number>;
    public toolbar: Dexie.Table<ToolBarInterface, number>;

    public constructor() {
        super("Linvo");
        this.version(1).stores({
            posts: "++id,linkedin_id,classify,finished,date",
            toolbar: "++id,show"
        });
        this.posts = this.table("posts");
        this.toolbar = this.table("toolbar");
    }

    getToolbarValue = async () => {
        const values = await this.toolbar.toArray();
        if (!values.length) {
            this.toolbar.add({
                show: true
            });
            return true;
        }
        return values[0].show;
    }

    setToolBarValue = async (value: boolean) => {
        const values = await this.toolbar.toArray();
        if (!values.length) {
            this.toolbar.add({
                show: value
            });
            return value;
        }

        values[0].show = value;
        this.toolbar.put(values[0]);
        return value;
    }
}

const LinvoDB = new Linvo();
export default LinvoDB;
