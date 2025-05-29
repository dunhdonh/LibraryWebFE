import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-200 py-10 px-6 md:px-16">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* Cột 1: Giới thiệu */}
    <div>
      <h2 className="text-lg font-semibold mb-2">Thư viện Bookio</h2>
      <p className="text-sm">
        Nơi kết nối tri thức và đam mê đọc sách. Cung cấp tài nguyên học tập và giải trí chất lượng cho mọi người.
      </p>
    </div>

    {/* Cột 2: Liên kết nhanh */}
    <div>
      <h3 className="text-lg font-semibold mb-2">Liên kết</h3>
      <ul className="space-y-1 text-sm">
        <li><a href="#" className="hover:underline">Giới thiệu</a></li>
        <li><a href="#" className="hover:underline">Liên hệ</a></li>
        <li><a href="#" className="hover:underline">Chính sách bảo mật</a></li>
        <li><a href="#" className="hover:underline">Hướng dẫn sử dụng</a></li>
      </ul>
    </div>

    {/* Cột 3: Mạng xã hội */}
    <div>
      <h3 className="text-lg font-semibold mb-2">Kết nối với chúng tôi</h3>
      <div className="flex space-x-4 mt-2">
        <a href="#" className="hover:text-white">
          <i className="fab fa-facebook-f"><FontAwesomeIcon icon={faFacebookF} /></i>
        </a>
        <a href="#" className="hover:text-white">
          <i className="fab fa-instagram"><FontAwesomeIcon icon={faInstagram} /></i>
        </a>
        <a href="#" className="hover:text-white">
          <i className="fab fa-twitter"><FontAwesomeIcon icon={faTwitter} /></i>
        </a>
        <a href="#" className="hover:text-white">
          <i className="fab fa-youtube"><FontAwesomeIcon icon={faYoutube} /></i>
        </a>
      </div>
    </div>
  </div>

  <div className="mt-10 text-center text-sm text-gray-400">
    © {new Date().getFullYear()} Thư viện Bookio. All rights reserved.
  </div>
</footer>

  );
};

export default Footer;
