import React from 'react';

const SignupScreen = () => {
  return (
    // screen-container: モバイルファーストで中央揃え、背景色と高さ
    <div className="max-w-md mx-auto p-5 bg-gray-50 min-h-screen text-center">
      <h1 className="text-3xl font-bold pt-10 mb-10 text-gray-800">新規登録</h1>

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
            className="w-full p-3 border border-gray-300 rounded-lg pr-12 focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition duration-150" 
          />
          {/* パスワード強度のインジケータ */}
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 font-bold text-xl">
            ■■■■
          </span>
        </div>
      </div>

      {/* メインボタン */}
      <button className="w-full py-4 mt-5 mb-6 text-lg font-bold text-white rounded-xl shadow-md transition duration-200 
                       bg-yellow-600 hover:bg-yellow-700">
        登録
      </button>
      
      {/* 規約同意とログインリンク */}
      <div className="text-sm text-gray-600 text-center">
        <label className="flex items-center justify-center mb-4 cursor-pointer">
          <input type="checkbox" className="mr-2 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded" />
          利用規約とプライバシーポリシーに同意する
        </label>
        <p className="cursor-pointer font-medium hover:text-yellow-700">すでにアカウントをお持ちの方はこちら</p>
      </div>
    </div>
  );
};

export default SignupScreen;