import React from 'react';

const LoginScreen = () => {
  return (
    // screen-container: モバイルファーストで中央揃え、背景色と高さ
    <div className="max-w-md mx-auto p-5 bg-gray-50 min-h-screen text-center">
      <h1 className="text-3xl font-bold pt-10 mb-10 text-gray-800">ログイン</h1>

      {/* メールアドレスのフォームグループ */}
      <div className="text-left mb-5">
        <label htmlFor="email" className="block mb-2 font-semibold text-gray-700">メールアドレス</label>
        <input 
          id="email" 
          type="email" 
          placeholder="メールアドレス" 
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition duration-150" 
        />
      </div>

      {/* パスワードのフォームグループ */}
      <div className="text-left mb-6">
        <label htmlFor="password" className="block mb-2 font-semibold text-gray-700">パスワード</label>
        <div className="relative">
          <input 
            id="password" 
            type="password" 
            placeholder="パスワード" 
            className="w-full p-3 border border-gray-300 rounded-lg pr-10 focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition duration-150" 
          />
          {/* 目のアイコン (視認性のためシンプルな文字で代替) */}
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer">👁</span>
        </div>
      </div>

      {/* メインボタン */}
      <button className="w-full py-4 mt-5 mb-6 text-lg font-bold text-white rounded-xl shadow-md transition duration-200 
                       bg-yellow-600 hover:bg-yellow-700">
        ログイン
      </button>

      {/* 補助リンク */}
      <div className="text-sm text-gray-600">
        <p className="mb-2 cursor-pointer hover:text-yellow-700">パスワードを忘れた方</p>
        <div className="w-4/5 h-px bg-gray-300 mx-auto my-4"></div>
        <p className="mb-4 cursor-pointer font-medium hover:text-yellow-700">新規登録はこちら</p>
      </div>

      {/* SNSログイン */}
      <div className="flex justify-center gap-4 mt-8">
        <button className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-300 bg-white shadow-sm hover:bg-gray-100 transition">
          <span className="text-xl font-bold">G</span> {/* Google */}
        </button>
        <button className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-300 bg-white shadow-sm hover:bg-gray-100 transition">
          <span className="text-xl font-bold"></span> {/* Apple */}
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;