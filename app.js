/**
 * Created by Андрей on 06.06.2015.
 */
angular.module('rx-example', ['rx']);

angular.module('rx-example').controller('MyController', function (rx, $scope) {
    var firstGroup = [{id: 1, group: '1'}, {id: 2, group: '1'}, {id: 3, group: '1'}];
    var secondGroup = [{id: 4, group: '2'}, {id: 5, group: '2'}, {id: 6, group: '2'}];
    var thirdGroup = [{id: 7, group: '3'}, {id: 8, group: '3'}, {id: 9, group: '3'}];
    var groups = [firstGroup, secondGroup, thirdGroup];

    $scope.groups = groups;
    var itemsReady,
        titleReady;

    $scope.canSave = function(){
        return itemsReady && titleReady
    };
    var state = {
        isReady: false,
        selected: {},
        groups:{},
        getItems:function(){
            return [].concat(this.selected[1],this.selected[2],this.selected[3])
        }
    };

    var handlers = {
        updateState: function (state, item) {
            if (item.checked) {
                if (!state.selected[item.group]) state.selected[item.group] = [];
                state.selected[item.group].push(item);
                state.groups[item.group] = true;
            }
            else if (angular.isArray(state.selected[item.group])) {
                var ind = state.selected[item.group].indexOf(item)
                state.selected[item.group].splice(ind, 1);
                state.groups[item.group] = state.selected[item.group].length>0;
            }
            state.isReady = state.groups["1"] &&  state.groups["2"] && state.groups["3"];
            return state;
        }
    }

    var source = $scope.$createObservableFunction('click')
        .do(function (x) {
            x.checked = !x.checked;
        });

    var items = source.startWith(state)
        .scan(handlers.updateState.bind(handlers))
        .do(function(x){
            itemsReady = x.isReady;
        })
        .filter(function (x) {
            return x.isReady
        })
        .map(function (x) {
            return x.getItems();
        });

    var title = $scope.$createObservableFunction('change').do(function(x){
        titleReady = !!x;
    });

    var result = Rx.Observable.combineLatest(items, title, function (items, title) {
        return {items: items, title: title};
    }).where(function (res) {
        return res.items.length && res.title;
    })

    $scope.$createObservableFunction('save').withLatestFrom(result, function (event, res) {
        return res;
    }).subscribe(function (res) {
        console.log('save', res);
        $scope.result = res;
    });

})
