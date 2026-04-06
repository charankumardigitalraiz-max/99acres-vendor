import os

filepath = 'src/pages/propertyDetails2.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Markers
m_main_start = '                    <div className="space-y-4 animate-in fade-in duration-500">'
m_cover_start = '                                {/* Cover Photo */}'
m_right_col_start = '                            {/* Right Column: Uploader Card + Ownership Proofs */}'
m_row2_start = '                        {/* Row 2: 5-Tab Details + Financial Sidebar */}'
m_tabbed_start = '                                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/20 overflow-hidden">'
m_bottom_bar = '                        {/* Bottom Admin Actions Bar */}'

# Extract Left 1 (Cover to just before Right Col Start)
pre_text = text[:text.find(m_main_start)]
left1 = text[text.find(m_cover_start):text.find(m_right_col_start)]
# Clean left1 ending wrappers
left1 = left1.rsplit('                            </div>', 1)[0].rstrip()

# Extract Right Block (Financial Sidebar + Ownership Proofs)
right_block = text[text.find(m_right_col_start):text.find(m_row2_start)]
# Right block has nested empty things:
# {/* Right Column: Uploader Card + Ownership Proofs */}
#                             <div className="lg:col-span-4 ">
#                                 {/* Uploader Card */}
#                                 {/* Right: Financial Sidebar */}
#                                 <div className="lg:col-span-4 flex flex-col gap-4">
# We can just extract everything inside it and strip out the weird wrappers later or leave them. Let's just strip the top wrappers:
right_content_start = text.find('                                    <div className="bg-white rounded-[2rem] border border-primary/20 shadow-2xl')
right_content_end = text.find(m_row2_start)
right_content = text[right_content_start:right_content_end]
# Remove closing tags of Row 1
right_content = right_content.rsplit('</div>', 1)[0]
right_content = right_content.rsplit('</div>', 1)[0]
right_content = right_content.rsplit('</div>', 1)[0].rstrip()

# Extract Left 2 (Tabbed Details)
left2 = text[text.find(m_tabbed_start):text.find(m_bottom_bar)]
# Clean left2 ending wrappers (Row 2 end)
left2 = left2.rsplit('</div>', 1)[0]
left2 = left2.rsplit('</div>', 1)[0]
left2 = left2.rsplit('</div>', 1)[0].rstrip()

post_text = text[text.find(m_bottom_bar):]

# Assemble New File
new_file = f'''{pre_text}                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
                        {{/* LEFT COLUMN (8 cols): Cover + Tabs */}}
                        <div className="lg:col-span-8 flex flex-col gap-6">
{left1}

{left2}
                        </div>

                        {{/* RIGHT COLUMN (4 cols): Financial + Proofs */}}
                        <div className="lg:col-span-4 flex flex-col gap-6">
{right_content}
                        </div>
                    </div>
{post_text}'''

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_file)

print('Transformation complete.')
