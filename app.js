// ローカルストレージAPI
// https://jp.vuejs.org/v2/examples/todomvc.html
var STORAGE_KEY = 'todos-vuejs-demo';
var todoStorage = {
    fetch: function () {
        var todos = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || '[]'
        );
        todos.forEach(function (todo, index) {
            todo.id = index
        });
        todoStorage.uid = todos.length;
        return todos
    },
    save: function (todos) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    }
};

const app = new Vue({
    el: '#app',
    data: {
        // 使用するデータ
        todos: [],

        // todo絞り込み用の選択肢を追加
        options: [
            {value: -1, label: "すべて"},
            {value: 0, label: "作業中"},
            {value: 1, label: "作業済み"},
        ],
        // 洗濯しているoptionsのvalueを記憶するためのデータ
        // 初期値は「すべて」とする
        current: -1
    },
    methods: {
        // 使用する処理
        doAdd: function (event, value) {
            // 入力されたtodoの入力値を取得
            var content = this.$refs.content;

            // 入力値がなければ、何もしないでreturn
            if (!content.value.length) {
                return
            }

            // [新しいID、content、状態]
            // というオブジェクトをtodosリストへpush
            // 作業状態(state)は、デフォルトで「作業中(=0)」にて作成
            this.todos.push({
                id: todoStorage.uid++,
                content: content.value,
                state: 0
            });

            content.value = ''
        },

        doChangeState: function (todo) {
            todo.state = todo.state ? 0 : 1
        },
        doRemove: function (todo) {
            var index = this.todos.indexOf(todo);
            this.todos.splice(index, 1)
        }
    },
    computed: {
        computedTodos: function () {
            // currentが-1なら全てそれ以外なら、currentとstateが一致するものだけ表示する
            return this.todos.filter(function (el) {
                return this.current < 0 ? true : this.current === el.state
            }, this)
        },
        //  作業中・完了のラベルを作成する
        labels() {
            return this.options.reduce(function (a, b) {
                return Object.assign(a, {[b.value]: b.label})
            }, {})
            // キーから見つけやすいように、次のように加工データを作成
            // {0: '作業中', 1: '作業済み', -1: 'すべて'}
        }
    },
    // 監視により、指定したeventが行われた際に行いたい処理を自動で行うようにする
    watch: {
        // 監視したいdataを指定
        // オプションを使う場合はオブジェクト形式とする
        todos: {
            // 行いたい処理をhandlerプロパティに定義する
            // 引数はwatchしているプロパティの変更後の値
            handler: function (todos) {
                todoStorage.save(todos)
            },
            // deepオプションでネストしているデータも監視できる
            deep: true
        }
    },

    created() {
        // インスタンス作成時に自動的にfetchする
        this.todos = todoStorage.fetch();
    }
});