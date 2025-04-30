import Header from "../components/Header";
import { Heart } from "lucide-react";

const HomePage = () => {
	return (
		<div
			className='flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 overflow-hidden'
		>
			<div className='flex-grow flex flex-col overflow-hidden'>
				<Header />
				<main className='flex-grow flex flex-col items-center justify-center text-center px-4'>
					<Heart className='text-pink-400 mb-6 animate-bounce' size={80} />
					<h1 className='text-4xl font-extrabold text-gray-800 mb-4'>
						Bienvenido a Tinder 💘
					</h1>
					<p className='text-xl text-gray-700 max-w-2xl'>
						Descubre nuevas conexiones, desliza perfiles interesantes y comienza a chatear en tiempo real.
						Crea una cuenta o inicia sesión para empezar a hacer match con personas afines a ti.
					</p>
				</main>
			</div>
		</div>
	);
};

export default HomePage;
