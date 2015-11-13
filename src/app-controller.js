export default function ($scope, $location, $timeout) {
    'ngInject';


    $scope.state = {isHidden: false};
    $scope.currentSlide = Number($location.search().slide) || 1;

    var intro = {
        id: 1,
        title: 'Intro',
        completed: false
    };

    var mantra = {
        id: 2,
        title: 'Mantra',
        completed: false
    };

    var streams = {
        id: 3,
        title: 'Streams',
        completed: false
    };

    var finish = {
        id: 4,
        title: 'Finish',
        completed: false,
        isLast: true
    };


    $scope.steps = [intro, mantra, streams, finish];

    //  ----intro----mantra----streams

    //  ----click----click---click

    var stepsObservable = Rx.Observable.
        fromArray($scope.steps).
        concat(Rx.Observable.fromArray([null])).
        pairwise().
        map((x)=> {
            x[0].next = x[1];
            if (x[1]) x[1].prev = x[0];
            return x[0];
        }).skipWhile((x)=> {
            return x.id !== $scope.currentSlide;
        });

    var published = stepsObservable.publish();

    published.take(1).subscribe((x)=> {
        x.isCurrent = true;
        $location.search('slide=' + x.id);
    })

    Rx.Observable.zip(published.skip(1), $scope.$createObservableFunction('onNext'), (x1, x2)=>x1).
        subscribe(setSlide.bind(this));

    published.connect();

    function setSlide(x) {
        x.prev.isCurrent = false;
        x.isCurrent = true;
        $scope.currentSlide = x.id;
        $timeout(function () {
            $location.search('slide=' + x.id);
        })
    }
}