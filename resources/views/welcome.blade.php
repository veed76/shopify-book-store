@extends('shopify-app::layouts.default')

@section('styles')
    @parent
    <link rel="stylesheet" href="https://unpkg.com/@shopify/polaris@7.1.0/build/esm/styles.css"/>
@endsection

@section('content')
    <div id="app"></div>
    <input type="hidden" name="csrf-token" content="{{ csrf_token() }}">
@endsection

@section('scripts')
    @parent
    <script src="{{mix('js/app.js')}}"></script>
    <script>
        actions.TitleBar.create(app, { title: 'Welcome' });
    </script>
@endsection
