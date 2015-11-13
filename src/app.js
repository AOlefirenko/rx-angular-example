import './styles.css';
import Rx from 'rx';
import angular from 'angular';
import rxAngular from 'rx-angular';
import controller from './app-controller.js'

angular.module('rx-example', ['rx']).run(function ($templateCache) {
    'ngInject'
    $templateCache.put('content.partial.html', require('./content.partial.html'));
    $templateCache.put('intro', require('./intro.partial.html'));
    $templateCache.put('mantra', require('./mantra.partial.html'));
    $templateCache.put('streams', require('./streams.partial.html'));
    $templateCache.put('finish', require('./finish.partial.html'));

}).controller('AppController',controller);





