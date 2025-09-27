import { translations } from './translations.js';
import { showNotification } from './utils.js';
import { showMainUI, showLoginUI, showLoadingUI, hideLoadingUI } from './ui.js';
import { saveInputState, restoreInputState } from './utils.js';

let hasShownLoginSuccess = false;

export function checkAccountStatus(db, uid) {
  if (!db) return Promise.resolve(false);
  const userDocRef = db.collection("users").doc(uid);
  return userDocRef.get().then((docSnap) => {
    if (docSnap.exists) {
      const userData = docSnap.data();
      const expiry = new Date(userData.expiry);
      const now = new Date();
      if (userData.disabled) {
        showNotification(translations.vn.accountDisabled, 'error');
        return false;
      } else if (now > expiry) {
        showNotification(translations.vn.accountExpired, 'error');
        return false;
      } else {
        return true;
      }
    } else {
      showNotification(translations.vn.noAccountData, 'error');
      return false;
    }
  }).catch((error) => {
    console.error("Lỗi khi kiểm tra tài khoản:", error);
    showNotification(translations.vn.accountCheckError, 'error');
    return false;
  });
}

export function monitorAccountActiveStatus(db, uid) {
  if (!db) return;
  const userDocRef = db.collection("users").doc(uid);
  userDocRef.onSnapshot((doc) => {
    if (!doc.exists || doc.data().active === false) {
      auth.signOut().then(() => {
        alert(translations.vn.accountDeactivated);
        showLoginUI();
        location.replace(location.pathname + '?v=' + Date.now());
      }).catch((error) => {
        console.error('Lỗi khi đăng xuất:', error);
        showNotification('Lỗi khi đăng xuất.', 'error');
      });
    }
  }, (error) => {
    console.error('Lỗi khi theo dõi tài liệu Firestore:', error);
    showNotification(translations.vn.accountCheckError, 'error');
  });
}

export function handleAuthStateChange(auth, db) {
  if (!auth || !db) {
    showNotification('Không thể khởi tạo Firebase. Vui lòng kiểm tra kết nối.', 'error');
    return;
  }
  showLoadingUI();
  auth.onAuthStateChanged((user) => {
    hideLoadingUI();
    if (user) {
      user.getIdTokenResult().then((idTokenResult) => {
        if (idTokenResult.claims.disabled) {
          showNotification(translations.vn.accountDisabled, 'error');
          auth.signOut();
          showLoginUI();
          saveInputState();
          location.replace(location.pathname + '?v=' + Date.now());
        } else {
          checkAccountStatus(db, user.uid).then((valid) => {
            if (valid) {
              monitorAccountActiveStatus(db, user.uid);
              showMainUI();
              if (!hasShownLoginSuccess) {
                showNotification(translations.vn.loginSuccess, 'success');
                hasShownLoginSuccess = true;
              }
              restoreInputState();
            } else {
              saveInputState();
              location.replace(location.pathname + '?v=' + Date.now());
            }
          });
        }
      }).catch((error) => {
        console.error("Lỗi khi kiểm tra token:", error);
        showNotification(translations.vn.accountCheckError, 'error');
        auth.signOut();
        showLoginUI();
        saveInputState();
        location.replace(location.pathname + '?v=' + Date.now());
      });
    } else {
      showLoginUI();
    }
  });
}

export function handleLogin(auth, db) {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
      showNotification('Vui lòng nhập email và mật khẩu!', 'error');
      return;
    }

    if (!auth) {
      showNotification('Không thể khởi tạo đăng nhập. Vui lòng kiểm tra kết nối.', 'error');
      return;
    }

    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        checkAccountStatus(db, user.uid).then((valid) => {
          if (valid) {
            monitorAccountActiveStatus(db, user.uid);
            showMainUI();
          } else {
            saveInputState();
            location.replace(location.pathname + '?v=' + Date.now());
          }
        });
      })
      .catch((error) => {
        console.error("Lỗi đăng nhập:", error.code, error.message);
        showNotification(translations.vn.loginFailed, 'error');
      });
  });
}

export function handleLogout(auth) {
  const logoutLink = document.getElementById('logout-link');
  if (!logoutLink) return;
  logoutLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (!auth) {
      showNotification('Không thể đăng xuất. Vui lòng kiểm tra kết nối.', 'error');
      return;
    }
    auth.signOut().then(() => {
      showLoginUI();
      showNotification(translations.vn.logoutSuccess, 'success');
      hasShownLoginSuccess = false;
      saveInputState();
      location.replace(location.pathname + '?v=' + Date.now());
    }).catch((error) => {
      console.error('Lỗi khi đăng xuất:', error);
      showNotification('Lỗi khi đăng xuất.', 'error');
    });
  });
}

export function addPaymentButton() {
  const header = document.getElementById('header');
  if (!header) return;
  const paymentButton = document.createElement('button');
  paymentButton.textContent = translations.vn.payButton;
  paymentButton.className = 'bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded';
  paymentButton.addEventListener('click', () => {
    window.location.href = 'https://your-momo-or-stripe-payment-link?price=4k&duration=1day';
  });
  header.appendChild(paymentButton);
}  userDocRef.onSnapshot((doc) => {
    if (!doc.exists || doc.data().active === false) {
      auth.signOut().then(() => {
        alert(translations.vn.accountDeactivated);
        showLoginUI();
        location.replace(location.pathname + '?v=' + Date.now());
      }).catch((error) => {
        console.error('Lỗi khi đăng xuất:', error);
        showNotification('Lỗi khi đăng xuất.', 'error');
      });
    }
  }, (error) => {
    console.error('Lỗi khi theo dõi tài liệu Firestore:', error);
    showNotification(translations.vn.accountCheckError, 'error');
  });
}

export function handleAuthStateChange(auth, db) {
  showLoadingUI();
  auth.onAuthStateChanged((user) => {
    hideLoadingUI();
    if (user) {
      user.getIdTokenResult().then((idTokenResult) => {
        if (idTokenResult.claims.disabled) {
          showNotification(translations.vn.accountDisabled, 'error');
          auth.signOut();
          showLoginUI();
          saveInputState();
          location.replace(location.pathname + '?v=' + Date.now());
        } else {
          checkAccountStatus(db, user.uid).then((valid) => {
            if (valid) {
              monitorAccountActiveStatus(db, user.uid);
              showMainUI();
              if (!hasShownLoginSuccess) {
                showNotification(translations.vn.loginSuccess, 'success');
                hasShownLoginSuccess = true;
              }
              restoreInputState();
            } else {
              saveInputState();
              location.replace(location.pathname + '?v=' + Date.now());
            }
          });
        }
      }).catch((error) => {
        console.error("Lỗi khi kiểm tra token:", error);
        showNotification(translations.vn.accountCheckError, 'error');
        auth.signOut();
        showLoginUI();
        saveInputState();
        location.replace(location.pathname + '?v=' + Date.now());
      });
    } else {
      showLoginUI();
    }
  });
}

export function handleLogin(auth, db) {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      if (!email || !password) {
        showNotification('Vui lòng nhập email và mật khẩu!', 'error');
        return;
      }

      auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          checkAccountStatus(db, user.uid).then((valid) => {
            if (valid) {
              monitorAccountActiveStatus(db, user.uid);
              showMainUI();
            } else {
              saveInputState();
              location.replace(location.pathname + '?v=' + Date.now());
            }
          });
        })
        .catch((error) => {
          console.error("Lỗi đăng nhập:", error.code, error.message);
          showNotification(translations.vn.loginFailed, 'error');
        });
    });
  }
}

export function handleLogout(auth) {
  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      auth.signOut().then(() => {
        showLoginUI();
        showNotification(translations.vn.logoutSuccess, 'success');
        hasShownLoginSuccess = false;
        saveInputState();
        location.replace(location.pathname + '?v=' + Date.now());
      }).catch((error) => {
        console.error('Lỗi khi đăng xuất:', error);
        showNotification('Lỗi khi đăng xuất.', 'error');
      });
    });
  }
}

// Mới: Thêm button thanh toán gia hạn (ví dụ redirect đến Momo hoặc Stripe)
export function addPaymentButton() {
  const paymentButton = document.createElement('button');
  paymentButton.textContent = translations.vn.payButton;
  paymentButton.className = 'bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded';
  paymentButton.addEventListener('click', () => {
    // Redirect đến trang thanh toán, ví dụ Momo hoặc Stripe checkout
    window.location.href = 'https://your-momo-or-stripe-payment-link?price=4k&duration=1day'; // Thay bằng link thực
  });
  document.getElementById('header')?.appendChild(paymentButton); // Giả định có #header
}
