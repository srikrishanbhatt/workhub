<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ $applicationName }}</title>
</head>
<body>
    <h1>Welcome to {{ $applicationName }}</h1>
    <p>Hello, {{ $name }}.</p>
    <p>
        <a href="{{ route('learn.controller', ['name' => 'Laravel Learner']) }}">
            Greet Laravel Learner
        </a>
    </p>
    <p>Your project-management workspace.</p>
</body>
</html>
