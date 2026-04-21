<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Delivery Login</title>
    <style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    body {
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .login-box {
        background: rgba(255, 255, 255, 0.95);
        padding: 40px 35px;
        width: 380px;
        border-radius: 16px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
        animation: fadeIn 0.6s ease-in-out;
    }

    .login-box h2 {
        text-align: center;
        margin-bottom: 30px;
        font-size: 28px;
        color: #111;
        letter-spacing: 1px;
    }

    .login-box input {
        width: 100%;
        padding: 14px;
        margin-bottom: 18px;
        border: 1px solid #ddd;
        border-radius: 10px;
        font-size: 15px;
        transition: 0.3s ease;
        background: #f9f9f9;
    }

    .login-box input:focus {
        border-color: #6b1511;
        outline: none;
        background: #fff;
        box-shadow: 0 0 0 3px rgba(107, 21, 17, 0.15);
    }

    .login-box button {
        width: 100%;
        padding: 14px;
        background: #6b1511;
        color: white;
        border: none;
        border-radius: 10px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .login-box button:hover {
        background: #8c1c17;
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
    }

    .error {
        color: #ff4d4d;
        text-align: center;
        margin-bottom: 15px;
        font-size: 14px;
        background: #ffecec;
        padding: 10px;
        border-radius: 8px;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>

</head>
<body>

<div class="login-box">
    <h2>Delivery Login</h2>

    @if(session('error'))
        <div class="error">
            {{ session('error') }}
        </div>
    @endif

    <form method="POST" action="/deli-login">
        @csrf

        <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            required
        >

        <input
            type="password"
            name="password"
            placeholder="Password"
            required
        >

        <button type="submit">Login</button>
    </form>
</div>

</body>
</html>

