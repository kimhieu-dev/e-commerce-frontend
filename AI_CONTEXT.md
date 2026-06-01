# AI Context - E-Commerce Project

Tài liệu này tổng hợp các quy tắc, kiến trúc và quy ước của dự án để đảm bảo tính nhất quán khi phát triển.

## 1. Kiến trúc tổng thể
- **Frontend**: React SPA (Vite + React 19).
- **Backend**: Spring Boot (Java 21, Spring Boot 4.x).
- **Giao tiếp**: REST API qua Axios.

---

## 2. Frontend (React)

### Tổ chức thư mục
- `src/api`: Cấu hình Axios (`axiosInstance.js`).
- `src/components`: Các component tái sử dụng, chia theo module (ví dụ: `Login/`).
- `src/pages`: Các component cấp trang (ví dụ: `HomePage.jsx`).
- `src/services`: Chứa logic gọi API và xử lý dữ liệu (ví dụ: `authService.js`).
- `src/App.jsx`: Cấu hình định tuyến (Routing) và bảo vệ route.

### Quy ước đặt tên (Naming Conventions)
- **Component & File**: PascalCase (ví dụ: `LoginForm.jsx`, `LoginPage.jsx`).
- **Function & Variable**: camelCase (ví dụ: `loginApi`, `hasAuth`).
- **Folder**: camelCase hoặc kebab-case.

### Thư viện chính
- `react`, `react-router-dom`: UI & Routing.
- `axios`: HTTP Client.
- `tailwindcss`, `postcss`: Styling.
- `lucide-react`: Icons.

### Coding Convention
- Sử dụng Functional Components và Hooks.
- Comments code bằng tiếng Việt.
- Quản lý trạng thái đăng nhập qua `localStorage` (`authHeader`).
- Luôn sử dụng `axiosInstance` để tự động đính kèm header Authorization (nếu có).

---

## 3. Backend (Spring Boot)

### Tổ chức thư mục (Package structure)
- `common`: Chứa các enum.
- `config`: Cấu hình Spring Boot.
- `controller`: Tiếp nhận request, định nghĩa endpoint.
- `service`: interface chứa các method xử lý logic nghiệp vụ.
- `service.impl`: implementation của interface `service`.
- `service.factory`: Tạo object cho service.
- `service.spec`: specification
- `repository`: Tương tác cơ sở dữ liệu (Spring Data JPA).
- `entity`: Định nghĩa cấu trúc bảng Database.
- `dto`: Chứa các đối tượng truyền tải dữ liệu (Request/Response).
- `dto.request`: Chứa các đối tượng Request.
- `dto.response`: Chứa các đối tượng Response.
- `mapper`: Chuyển đổi giữa Entity và DTO (MapStruct).
- `exception`: Xử lý lỗi tập trung.


### Quy ước đặt tên
- **Class**: PascalCase (ví dụ: `AuthController`, `ProductService`).
- **Method & Variable**: camelCase (ví dụ: `register`, `authService`).
- **DTO**: Hậu tố `Req` cho Request và `Res` cho Response (ví dụ: `LoginReq`, `LoginRes`).
- **Endpoint**: kebab-case (ví dụ: `/api/v1/auth/login`).

### Thư viện & Công nghệ
- **Java 21**, **Spring Boot 4.0.5**.
- **Spring Data JPA**, **MySQL**.
- **Lombok**: Giảm thiểu code boilerplate (`@Data`, `@RequiredArgsConstructor`, ...).
- **Spring Security & JWT**: Bảo mật.
- **MapStruct**: Mapping đối tượng.

### Coding Convention
- Tuân thủ RESTful API.
- Luôn bọc kết quả trả về trong `BaseResponse`.
- Sử dụng `@RequiredArgsConstructor` để inject dependency thay vì `@Autowired`.
- Validate dữ liệu đầu vào bằng `jakarta.validation`.

---

## 4. Lưu ý quan trọng
- **KHÔNG** chỉnh sửa code Backend trừ khi có yêu cầu đặc biệt (vì Backend đã hoàn thiện).
- Luôn kiểm tra `AI_CONTEXT.md` trước khi triển khai tính năng mới để đảm bảo đúng quy ước.
