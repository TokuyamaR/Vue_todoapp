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
    },
    methods: {
        // 使用する処理
        methods: {
            doAdd: function (e, value) {
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
                    content: comment.value,
                    state: 0
                });

                comment.value = ''
            },

            doChangeState: function (item) {
                item.state = item.state ? 0 : 1
            },
            doRemove: function (item) {
                var index = this.todos.indexOf(item);
                this.todos.splice(index, 1)
            }
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
    }
});