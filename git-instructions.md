## Using Git


### Part 1 - Install Git

1. **Go to**: [https://git-scm.com](https://git-scm.com)
    
2. **Click** "Download for Windows" (it auto-detects the OS).
    
3. Run the installer:
	
    - Use **default options** unless you have a reason to change.
        
    - Recommend **"Use Git from the command line and also from 3rd-party software"**.
        
    - Choose **VS Code** if it asks for a default editor.
    
4. Open VS Code and Set Git Bash as Default Terminal
	
	- Open **Command Palette**: `Ctrl + Shift + P`
	    
	- Type: `Terminal: Select Default Profile`
	    
	- Choose: **Git Bash**
	    
	- Then open the terminal:  
	    `Ctrl + ~` (tilde) or go to **Terminal → New Terminal**
	    
	- You should now see Git Bash running inside VS Code.
	
5. **Test it works**  
	In the terminal, type:

```bash
git --version
```




### Part 2 - Git Global Configuration (First-time Setup)

Run these commands to set your name and email (used for commits):

```bash
git config --global user.name "Your Name" 
git config --global user.email "youremail@example.com"`
```

Check they’re saved:

```bash
git config --list
```

Press [enter] for more details or [q] to exit




### Part 3 - Initialize a Git Repo Locally


1. Open terminal in project folder, or:

```bash
# This shouldn't be necessary
cd path/to/your/project
```

2. Initialize Git:
 
```bash
git init
```

3. Create *.gitignore* file:

```bash
touch backend/.gitignore
```

4. Add these to it:

```gitignore
node_modules/

.env
```

5. Stage all files:

```bash
git add .
```

6. Commit them:

```bash
git commit -m "First commit"
```




### Part 4 - Create Remote Repo on GitHub

- Go to [https://github.com](https://github.com)
	
- Create an account
	
- Click **"Repositories"** 
    
- Click **"New"**
    
- Fill in:
	
    - Name: _same as your project folder (optional but tidy)_
        
    - Keep **"Initialize with README"** **unchecked** (important if local already has files)
    
- Click **Create Repository**




### Part 5 - Link Local Repo to GitHub & Push

1. Copy the **HTTPS** URL of the new repo (e.g. `https://github.com/username/repo-name.git`)
	
2. Then follow the instructions on GitHub.

##### If no instructions:

1. Run this in the terminal with actual URL:

```bash
# Example
git remote add origin https://github.com/username/repo-name.git
```

3. Push to GitHub:

```bash
git push -u origin master
```

⚠️ Note: If GitHub uses `main` instead of `master`, either rename your branch:

```bash
git branch -M main
git push -u origin main
```

or create the remote repo with a `main` branch to match.




### Bonus - Common Issues to Warn About

- **Wrong remote URL** → run `git remote -v` to check
    
- **Push rejected (non-fast-forward)** → caused by a mismatch between local and GitHub histories
    
- **Untracked files not added** → use `git add .` before committing




### Git Cheat Sheet

#### 🔍 **Check the Status of Your Repo**

```bash
git status          # See current changes and staged files
```

#### ➕ **Staging & Committing**

```bash
git add .                 # Stage all changes 
git add filename          # Stage a specific file 
git reset filename        # Unstage a file (remove from staging)  
git commit -m "message"   # Commit staged changes with a message
```

#### 🕵️‍♂️ **Viewing Commit History**

```bash
git log                  # Full commit history 
git log --oneline        # Compact commit history (1 line per commit) 
git log --stat           # Show changes per file in each commit
```

#### 🔗 **Working with Remotes**

```bash
git remote -v               # Show linked remotes 
git remote add origin URL   # Add remote GitHub repo
```

#### ⬆️ **Pushing to GitHub**

```bash
git push -u origin main      # Push to remote (first time) 
git push                     # Push changes (after first push)
```

#### ⬇️ **Pulling from Remote**

```bash
git pull                     # Pull latest changes from remote
```

#### **🧲 Cloning

```bash
git clone <repo-url>                    # Clone a remote repo to local

# Example
git clone https://github.com/user/repo.git
```

#### **📦Stashing (Temporary save)

```bash
git stash                               # Stash uncommitted changes
git stash list                          # Show all stashes
git stash apply                         # Reapply last stash and keeps it
git stash apply stash@{n}               # Apply a specific stash but keeps it
git stash pop                           # Applies and removes latest stash
git stash pop stash@{1}                 # Applies and removes specific stash
git stash drop stash@{n}                # Delete a specific stash
git stash clear                         # Clear all stashes
```

#### 📝 **Unstage changes from Git**

```bash
git reset     # Unstages changes from git add .
```

#### 📝 **Untrack/Delete a File from Git**

```bash
git rm --cached filename     # Stop tracking a file (keeps file locally)
```

#### ❌ **Undo Uncommitted Changes**

```bash
git checkout -- filename     # Discard local changes to a file
```

#### 🔁 **Undo a Commit (Before Push)**

```bash
git reset --soft HEAD~1      # Undo last commit but keep changes staged 
git reset --mixed HEAD~1     # Undo last commit and unstage files 
git reset --hard HEAD~1      # Completely erase last commit and changes
```

 ⚠️ Be careful with `--hard` – it deletes changes!

#### 📂 **Delete All Local Changes (Reset to Last Commit)**

```bash
git restore .                # Discard all uncommitted changes
```

#### 🗑️ **Remove Git altogether

```bash
rm -rf .git               # Deletes Git
```
---

### 🧪 **Branching (Basics)**

```bash
git branch                   # List branches 
git branch branch-name       # Creates new branch
git checkout branch-name     # Changes branch
git checkout -b new-branch   # Create and switch to new branch 
git checkout main            # Switch back to main 
git merge new-branch         # Merge another branch into current one
```