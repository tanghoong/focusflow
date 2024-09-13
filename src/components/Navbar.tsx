'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Settings, PanelRight, ChevronDown } from 'lucide-react';
import PomodoroTimer from './KanbanBoard/PomodoroTimer';
import AgendaSidebar from './AgendaSidebar';

const Navbar: React.FC = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isAgendaOpen, setIsAgendaOpen] = useState(false);

	const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
	const toggleAgenda = () => setIsAgendaOpen(!isAgendaOpen);

	return (
		<>
			<nav className="bg-solarized-base02 text-solarized-base1">
				<div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						<div className="flex items-center">
							<Link href="/" className="text-xl font-bold mr-4">
								Kanban
							</Link>
						</div>
						<div className="flex items-center">
							<PomodoroTimer />
						</div>
					</div>
				</div>
			</nav>
			<AgendaSidebar isOpen={isAgendaOpen} onClose={toggleAgenda} />
		</>
	);
};

export default Navbar;